const Poll = require("../Models/Poll");
const Vote = require("../Models/Vote");

//  Créer un nouveau sondage
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const challengeId = req.params.challengeId;

    const poll = new Poll({
      question,
      options,
      challenge: challengeId,
      createdBy: req.user.id
    });
    await poll.save();
    res.status(201).json({ message: "Sondage créé", poll });

  } catch (err) {
    console.error("Erreur createPoll:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//  Voter pour une option
exports.vote = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const pollId = req.params.pollId;
    const userId = req.user.id;

    const alreadyVoted = await Vote.findOne({ poll: pollId, user: userId });
    if (alreadyVoted) {
      return res.status(400).json({ msg: "Vous avez déjà voté." });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ msg: "Sondage introuvable." });
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
    const poll = await Poll.findByIdAndUpdate(
      req.params.pollId,
      { isClosed: true },
      { new: true }
    );
    res.status(200).json({ message: "Sondage clôturé", poll });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
