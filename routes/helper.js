const router = require('express').Router({ mergeParams: true })

const {getImageCatalog, getAImageFromCatalog} = require('../controllers/imageHelper')

router.get('/get-images',getImageCatalog)

router.get('/:photoName',getAImageFromCatalog)

module.exports = router;