import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { Email, password } = req.body

  const user = await User.findOne({ Email })
  if ((user) && (user.password = password)) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      Email: user.Email,
      isAdmin: user.isAdmin,
      imgURL : user.imgURL,
      token: generateToken(user._id),
    })
    req.user = user;
  } else {
    res.status(401)
    throw new Error('email ou mot de passe incorrect')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body)
  const {  name,Email, password ,imgURL} = req.body


  const userExists = await User.findOne({ Email })

  if (userExists) {
    res.status(400);
    throw new Error('Utilisateur existe deja')
  }

  const user = await User.create({
    name,
    Email,
    password,
    imgURL
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      Email: user.email,
      isAdmin: user.isAdmin,
      imgURL : user.imgURL,
      token: generateToken(user._id),
    })
  } else {
    
    throw new Error('Les données sont invalides');
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      Email: user.Email,
      isAdmin: user.isAdmin,
     imgURL: user.imgURL,
    })
  } else {
    res.status(404)
    throw new Error(" L'utilisateur non trouvé")
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.Email = req.body.Email || user.Email
    user.imgURL = req.body.imgURL || user.imgURL
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      Email: updatedUser.Email,
      isAdmin: updatedUser.isAdmin,
      imgURL: updatedUser.imgURL,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error("L'utilisateur non trouvé")
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'utilisateur supprimé ' })
  } else {
    res.status(404)
    throw new Error("L'utilisateur non trouvé")
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("L'utilisateur non trouvé")
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      photoUrl : updatedUser.photoUrl,
    })
  } else {
    res.status(404)
    throw new Error("L'utilisateur non trouvé")
  }
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
