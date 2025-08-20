const Poll = require("../Models/Poll");
const Vote = require("../Models/Vote");
const Group = require("../Models/Group");

//  Créer un nouveau sondage (pour défi)
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const challengeId = req.params.challengeId;

    const poll = new Poll({
      question,
      options,
      challenge: challengeId,
      createdBy: req.user.userId,
      type: 'challenge'
    });
    await poll.save();
    res.status(201).json({ message: "Sondage créé", poll });

  } catch (err) {
    console.error("Erreur createPoll:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//  Créer un nouveau sondage dans un groupe
exports.createGroupPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const groupId = req.params.groupId;
    const userId = req.user.userId;

    // Vérifier que l'utilisateur est membre du groupe
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe introuvable" });
    }

    if (!group.members.includes(userId)) {
      return res.status(403).json({ error: "Vous devez être membre du groupe pour créer un sondage" });
    }

    // Valider les options
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Au moins 2 options sont requises" });
    }

    const poll = new Poll({
      question,
      options: options.map(text => ({ text, votes: 0 })),
      group: groupId,
      createdBy: userId,
      type: 'group'
    });

    await poll.save();

    // Populer les données pour la réponse
    const populatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'username firstName lastName')
      .populate('group', 'name');

    // Émettre via Socket.IO si disponible
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${groupId}`).emit('poll:created', {
        poll: populatedPoll,
        groupId
      });
    }

    res.status(201).json({ 
      message: "Sondage créé dans le groupe", 
      poll: populatedPoll 
    });

  } catch (err) {
    console.error("Erreur createGroupPoll:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//  Voter pour une option
exports.vote = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const pollId = req.params.pollId;
    const userId = req.user.userId;

    const alreadyVoted = await Vote.findOne({ poll: pollId, user: userId });
    if (alreadyVoted) {
      return res.status(400).json({ msg: "Vous avez déjà voté." });
    }

    const poll = await Poll.findById(pollId)
      .populate('group', 'name members')
      .populate('challenge', 'title');
    
    if (!poll) {
      return res.status(404).json({ msg: "Sondage introuvable." });
    }

    // Vérifier les permissions pour les sondages de groupe
    if (poll.type === 'group' && poll.group) {
      if (!poll.group.members.includes(userId)) {
        return res.status(403).json({ msg: "Vous devez être membre du groupe pour voter." });
      }
    }

    if (poll.isClosed) {
      return res.status(403).json({ msg: "Ce sondage est clôturé. Il n'est plus possible de voter." });
    }

    if (typeof optionIndex !== "number" || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ msg: "Index d'option invalide." });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    await Vote.create({ poll: pollId, user: userId, optionIndex });

    // Émettre via Socket.IO pour les sondages de groupe
    if (poll.type === 'group' && poll.group) {
      const io = req.app.get('io');
      if (io) {
        io.to(`group:${poll.group._id}`).emit('poll:voted', {
          pollId,
          optionIndex,
          poll,
          groupId: poll.group._id
        });
      }
    }

    res.status(200).json({ msg: "Vote enregistré", poll });

  } catch (err) {
    console.error("Erreur vote:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


//  Voir les résultats
exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ msg: "Sondage introuvable." });

    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Clôturer un sondage
exports.closePoll = async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const userId = req.user.userId;

    const poll = await Poll.findById(pollId)
      .populate('group', 'name members')
      .populate('createdBy', 'username');

    if (!poll) {
      return res.status(404).json({ error: "Sondage introuvable" });
    }

    // Vérifier les permissions : seul le créateur peut clôturer
    if (poll.createdBy._id.toString() !== userId) {
      return res.status(403).json({ error: "Seul le créateur du sondage peut le clôturer" });
    }

    poll.isClosed = true;
    await poll.save();

    // Émettre via Socket.IO pour les sondages de groupe
    if (poll.type === 'group' && poll.group) {
      const io = req.app.get('io');
      if (io) {
        io.to(`group:${poll.group._id}`).emit('poll:closed', {
          pollId,
          poll,
          groupId: poll.group._id
        });
      }
    }

    res.status(200).json({ message: "Sondage clôturé", poll });
  } catch (err) {
    console.error("Erreur closePoll:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer tous les sondages d'un groupe
exports.getGroupPolls = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.userId;

    // Vérifier que l'utilisateur est membre du groupe
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Groupe introuvable" });
    }

    if (!group.members.includes(userId)) {
      return res.status(403).json({ error: "Vous devez être membre du groupe pour voir les sondages" });
    }

    const polls = await Poll.find({ group: groupId, type: 'group' })
      .populate('createdBy', 'username firstName lastName profileImage')
      .sort({ createdAt: -1 });

    // Ajouter l'information si l'utilisateur a déjà voté
    const pollsWithVoteStatus = await Promise.all(
      polls.map(async (poll) => {
        const userVote = await Vote.findOne({ poll: poll._id, user: userId });
        return {
          ...poll.toObject(),
          hasVoted: !!userVote,
          userVoteIndex: userVote ? userVote.optionIndex : null
        };
      })
    );

    res.status(200).json({
      polls: pollsWithVoteStatus,
      count: pollsWithVoteStatus.length
    });

  } catch (err) {
    console.error("Erreur getGroupPolls:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
