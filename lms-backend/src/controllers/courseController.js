import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { logger } from '../utils/logger.js';

export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructorId: req.user.id
    });
    res.status(201).json({
      status: 'success',
      data: { course }
    });
  } catch (err) {
    logger.error(`Create course error: ${err.message}`);
    next(err);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const whereClause = {};
    if (req.user.role === 'instructor') {
      whereClause.instructorId = req.user.id;
    }

    const courses = await Course.findAll({ where: whereClause });
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: { courses }
    });
  } catch (err) {
    logger.error(`Get courses error: ${err.message}`);
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Module,
          include: [Lesson]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { course }
    });
  } catch (err) {
    logger.error(`Get course error: ${err.message}`);
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    await course.update(req.body);
    res.status(200).json({
      status: 'success',
      data: { course }
    });
  } catch (err) {
    logger.error(`Update course error: ${err.message}`);
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    await course.destroy();
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    logger.error(`Delete course error: ${err.message}`);
    next(err);
  }
};

export const enrollToCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    // Check capacity
    const enrollmentsCount = await Enrollment.count({
      where: { courseId: course.id, status: 'active' }
    });

    if (enrollmentsCount >= course.capacity) {
      return res.status(400).json({
        status: 'fail',
        message: 'Course is full'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { userId: req.user.id, courseId: course.id }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        status: 'fail',
        message: 'Already enrolled to this course'
      });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId: course.id,
      status: 'active'
    });

    res.status(201).json({
      status: 'success',
      data: { enrollment }
    });
  } catch (err) {
    logger.error(`Enroll to course error: ${err.message}`);
    next(err);
  }
};
