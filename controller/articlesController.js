import asyncHandler from 'express-async-handler'
import moment from 'moment'
import Article from '../models/ArticleModel.js'




// @desc    Register a new Article
// @route   POST /api/Articles
// @access  Public
const registerArticle = asyncHandler(async (req, res) => {
  const publishedDate = moment().format('ll');
  const {writter,userImgUrl,Title,Description,userId,ArticleContent,CoverImage} = req.body
  const article = await Article.create({
    writter,
    userImgUrl,
    Title,
    CoverImage,
    Description,
    ArticleContent,
    userId,
    publishedDate,
  })

  if (!article) {
   
    res.status(400)
    throw new Error('Les données sont invalides')
  
}
}
)



// @desc    Update Article profile
// @route   PUT /api/Articles/profile
// @access  Private
const updateArticleProfile = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.Article._id)

  if (article) {
    article.name = req.body.name || article.name
    article.email = req.body.email || article.email
    if (req.body.password) {
      article.password = req.body.password
    }

    const updatedarticle = await article.save()

    res.json({
      _id: updatedArticle._id,
      name: updatedArticle.name,
      email: updatedArticle.email,
      isAdmin: updatedArticle.isAdmin,
      photoUrl : updatedArticle.photoUrl,
      token: generateToken(updatedArticle._id),
    })
  } else {
    res.status(404)
    throw new Error("L'utilisateur non trouvé")
  }
})

// @desc    Get all Articles
// @route   GET /api/Articles
// @access  Private/Admin
const getArticles = asyncHandler(async (req, res) => {
  const Articles = await Article.find({})
  console.log(Articles)
  res.json(Articles)
})

// @desc    Delete Article
// @route   DELETE /api/Articles/:id
// @access  Private/Admin
const deleteArticle = asyncHandler(async (req, res) => {
  let  ItemToRemoved = await Article.findById(req.params.articleId)

  if (ItemToRemoved) {
    await ItemToRemoved.remove()
    res.json({ message: 'Article supprimé ' })
  } else {
    res.status(404)
    throw new Error("Article non trouvé")
  }
})

// @desc    Get Article by ID
// @route   GET /api/Articles/:id
// @access  Private/Admin
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.articleId)
  if (article) {
    res.json(article)
  } else {
    res.status(404)
    throw new Error("L'utilisateur non trouvé")
  }
})
// @desc    Get Article by UserID
// @route   GET /api/Articles/:id
// @access  Private/Admin
const getUserArticleById = asyncHandler(async (req, res) => {
    const Articles = await Article.find().where({userId : req.params.userId})
  
    if (Articles) {
      res.json(Articles)
    } else {
      res.status(404)
      throw new Error("L'utilisateur non trouvé")
    }
  })

  const createArticleComment = asyncHandler(async (req, res) => {
    const {Username,photoUrl,comment} = req.body
  
    const article = await Article.findById(req.params.articleId)
  
    if (article) {
     
  
      const Comment = {
         Username,
         photoUrl,
        comment,
      }
  
      article.comments.push(Comment)
  
      article.numComments = article.comments.length
  
     
  
      await article.save()
      res.status(201).json({ message: 'comment ajoute' })
    } else {
      res.status(404)
      throw new Error('article non trouve')
    }
  })
  const getLatestArticle = asyncHandler(async (req, res) =>{
    const article = await Article.findOne().sort({$natural:-1}).limit(1)
    res.json(article)
  })
export {
  registerArticle,
  updateArticleProfile,
  getArticles,
  deleteArticle,
  getArticleById,
  getUserArticleById,
  createArticleComment,
  getLatestArticle
}
