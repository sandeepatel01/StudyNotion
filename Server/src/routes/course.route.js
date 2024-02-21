import { Router } from "express";
import { isAdmin, isInstructor, isStudent, verifyJWT } from "../middlewares/auth.middleware";
import { createCourse, getAllCourses, getCoursesDetails } from "../controllers/course.controller"
import { addSection, deleteSection, updateSection } from "../controllers/section.controller";
import { addSubSection, deleteSubSection, updateSubSection } from "../controllers/subSection.controller";
import { categoryPageDetails, createCategory, getAllCategory } from "../controllers/category.controller";
import { createRating, getAllRating, getAverageRating } from "../controllers/ratingAndReviews.controller"

const router = Router();

router.route('/create-course').post(verifyJWT, isInstructor, createCourse);
router.route('/get-all-courses').get(getAllCourses);
router.route('/get-course-details').post(getCoursesDetails);

router.route('/add-section').post(verifyJWT, isInstructor, addSection);
router.route('/update-section').post(verifyJWT, isInstructor, updateSection);
router.route('/delete-section').post(verifyJWT, isInstructor, deleteSection);

router.route('/add-subSection').post(verifyJWT, isInstructor, addSubSection);
router.route('/update-subSection').post(verifyJWT, isInstructor, updateSubSection);
router.route('/delete-subSection').post(verifyJWT, isInstructor, deleteSubSection);

router.route('/create-category').post(verifyJWT, isAdmin, createCategory);
router.route('/all-category').get(getAllCategory);
router.route('/category-page').post(categoryPageDetails);

router.route('/create-rating').post(verifyJWT, isStudent, createRating);
router.route('/average-rating').get(getAverageRating);
router.route('/all-reviews').post(getAllRating);

export default router;