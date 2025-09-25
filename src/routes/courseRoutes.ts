import { Router, type Request, type Response } from "express";
 
import { courses  } from "../db/db.js";
import {
  zCourseDeleteBody,
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
} from "../schemas/courseValidator.js";
import type { Course } from "../libs/types.js";
const routerc: Router = Router();

// READ all
routerc.get("/courses", (req: Request, res: Response) => {
  try {
    return res.status(200).json(courses);
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});
// Params URL
routerc.get("/courses/:courseId", (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const result = zCourseId.safeParse(courseId);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const findcourse = courses.findIndex(
      (course) => course.courseId === courseId
    );

    if (findcourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exists",
      });
    }
    res.set("Link", `/courses/${courseId}`);
    return res.status(200).json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: courses[findcourse],
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

routerc.post("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;

    const result = zCoursePostBody.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundcourse = courses.find(
      (course) => course.courseId === body.courseId
    );

    if (foundcourse) {
      return res.status(409).json({
        success: false,
        message: "Course is already exists",
      });
    }
    res.set("link", `/courses/${body.courseId}`);
    courses.push(body);

    return res.status(201).json({
      success: true,
      message: `Course ${body.courseId} has been added successfully` ,
      data: {
        body 
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

routerc.put("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;
    const result = zCoursePutBody.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundcourse = courses.findIndex(
      (course) => course.courseId === body.courseId
    );

    if (foundcourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id is not exists",
      });
    }
    res.set("link", `/courses/${body.courseId}`);
    courses[foundcourse] = { ...courses[foundcourse], ...body };

    return res.status(200).json({
      success: true,
      message: `course ${courses[foundcourse].courseId} has been updated successfully`,
      data: courses[foundcourse],
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

routerc.delete("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body;

    const result = zCourseDeleteBody.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundcourse = courses.findIndex(
      (course) => body.courseId === course.courseId
    );

    if (foundcourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id is not exists",
      });
    }
    const deletecourse = courses[foundcourse];
    courses.splice(foundcourse, 1);
    res.set("link", `/courses/${body.courseId}`);
    return res.status(200).json({
      success: true,
      message: `Course ${deletecourse?.courseId} has been deleted successfully`,
      data: deletecourse,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

export default routerc;