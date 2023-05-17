const { User, Thought } = require('../models');

module.exports = {
 // Get Users
 async getUsers (req, res){
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Get user
  async getUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v');

      if (!user) {
        res.status(404).json({ message: 'No user with that ID 🫣' })
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // create user
  async createUser (req, res) {
     try {
       const dbUser = await User.create(req.body);
       console.log(dbUser);
       res.json(dbUser);
     } catch (err) {
       res.status(500).json(err);
     }
   },

  // Update user
  async updateUser (req, res){
    try{
      const upUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {new: true }
        );
        if (!upUser) {
          res.status(404).json({ message: 'Nothing here... 😶‍🌫️' });
        }
        res.json(upUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete and remove thoughts from the user
  async  deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({_id: req.params.userId});

      if (!user){
        return res.status(404).json({ message: 'No user exists with that ID' });
      }
      await Thought.deleteMany(
        { _id: {$in: user.thoughts} });
        res.json({message:'User and thoughts deleted'});
     } catch (err) {
      res.status(500).json(err);
    };
  },
  // Add Friend 
  async addFriend (req, res) {
    try {
      const {userId, friendId } = req.params;

      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user found with that ID :(' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove Friend 

  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID, sorry :(' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
  
  
};
