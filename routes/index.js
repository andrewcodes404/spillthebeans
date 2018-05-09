const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

//home
router.get('/', docController.home);

//about
router.get('/about', docController.about)

//recipe single
router.get('/recipe/:slug', catchErrors(docController.recipe))

//recipes
router.get('/recipes', catchErrors(docController.recipes))
router.get('/recipes/:tag', catchErrors(docController.recipes));

// router.get('/tags', catchErrors(storeController.getStoresByTag));
// router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));






// **-ADD-** **-ADD-** **-ADD-** **-ADD-** **-ADD-** **-ADD-*

//add GET
router.get('/editor',
  authController.isLoggedIn,
  docController.editor);

//add POST
router.post('/editor',
  docController.upload,
  docController.imageURL,
  catchErrors(docController.createDoc),
);


// **-EDIT-** **-EDIT-** **-EDIT-** **-EDIT-** **-EDIT-**

// edit (GET)
router.get('/recipe/:slug/edit',
  authController.isLoggedIn,
  catchErrors(docController.editDoc)
);
// edit/update (POST)
router.post('/editor/:slug',
  docController.upload,
  docController.imageURL,
  catchErrors(docController.updateDoc)
);











/// USER -- USER -- USER -- USER -- USER -- USER -- USER -- USER --



//register GET
router.get('/register', authController.isLoggedIn, userController.registerForm)
//register POST
router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
);

// login GET
router.get('/login', userController.loginForm );
//login POST
router.post('/login', authController.login)

//log-out
router.get('/logout', authController.logout);



//user-edit GET
router.get('/account', authController.isLoggedIn, userController.account);
// user-edit POST
router.post('/account', catchErrors(userController.updateAccount));


//password-forgot GET
router.post('/account/forgot', catchErrors(authController.forgot));
//password reset page GET
router.get('/account/reset/:token', catchErrors(authController.reset));

// password update/save post
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);



module.exports = router;
