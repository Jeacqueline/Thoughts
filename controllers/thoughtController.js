const { Thought, User } = require('../models');

module.exports = {
 // Get thoughts
 async getThoughts (req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get Thought
  async  getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        if(!thought){
          return res.status(404).json({message: 'No thought with that ID'});
        }
        res.json(thought);
      } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create Thought
  async createThought (req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate({_id: req.body.userId},
        {$push:{thoughts: thought._id}}, {new: true});
      
      if (!user) {
        return res.status(404).json({ message: 'Nothing with that information' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err)
    }
  },
   // Update Thought
   async updateThought (req, res) {
    try {
      const upThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true }
      );

      if (!upThought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }
      res.status(200).json(upThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete Thought
  async deleteThought (req, res) {
    try {
      const delThought = await Thought.findOneAndDelete({_id: req.params.thoughtId});

      if (!delThought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = await User.findOneAndUpdate(delThought.userId,
        {$pull:{thoughts: delThought._id}},
        {new: true});
       if(!user){
        return res.status(404).json({message: 'Yaaay this thought created but no user with this id 🤫'});
       }
       res.json({message:'Thought successfully deleted 🤖'});
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async  updateThought(req, res){
    try{
      const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body,{
        new:true,
      });
      if(!thought){
        res.status(404).json({message:' Try with another Id'});
      } 
      res.json(thought);
    }catch(err){
      res.status(500).json(err);
    }

  },
 
  // Create Reaction
  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        { $push: { reactions: req.body } },
        { runValidators:true, new: true }
      );
      if (!thought) {
        res.status(404).json ({ message: 'No thought with that ID'});
      }
      res.json(thought);
    } catch(err) {
      res.status(500).json(err)
    }
  },
  // Delete Reaction
  async  deleteReaction(req, res) {
    try {

      const thought = await Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true}
      );

      if (!thought) {
        return res.status(404).json ({ message: 'No thought with that ID'});
      }
      res.json(thought);
    } catch(err) {
      res.status(500).json(err)
    }
  },
};