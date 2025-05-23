import ContentBlock from '../models/ContentBlock.js';
import Progress from '../models/Progress.js';
import { logger } from '../utils/logger.js';

export const saveContent = async (req, res, next) => {
  try {
    const { lessonId, content } = req.body;
    
    // Save or update content blocks
    await Promise.all(
      content.map(block => 
        ContentBlock.upsert({
          ...block,
          lessonId
        })
      )
    );

    res.status(200).json({
      status: 'success',
      message: 'Content saved successfully'
    });
  } catch (err) {
    logger.error(`Save content error: ${err.message}`);
    next(err);
  }
};

export const trackProgress = async (req, res, next) => {
  try {
    const { lessonId, userId, courseId } = req.body;

    const [progress] = await Progress.findOrCreate({
      where: { 
        userId,
        lessonId,
        courseId 
      },
      defaults: {
        status: 'in_progress'
      }
    });

    if (progress.status !== 'completed') {
      await progress.update({
        status: 'completed',
        completedAt: new Date()
      });
    }

    res.status(200).json({
      status: 'success',
      data: { progress }
    });
  } catch (err) {
    logger.error(`Track progress error: ${err.message}`);
    next(err);
  }
};

export const getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findAll({
      where: {
        userId: req.user.id,
        courseId: req.params.courseId
      },
      include: ['Lesson']
    });

    res.status(200).json({
      status: 'success',
      data: { progress }
    });
  } catch (err) {
    logger.error(`Get progress error: ${err.message}`);
    next(err);
  }
};
