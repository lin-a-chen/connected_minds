import User from "@/models/User";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import Lesson from "@/models/Lesson";

export async function PUT(req) {
    const body = await req.json();
    try{
        const userResult = await User.findByEmail(body.teachers_email);
        if (!userResult.success || !userResult.data){
            return new Response(JSON.stringify({success: false, data: 'Користувача з даним email не знайдено'}), {status: 404});
        }


        const teacherResult = await Teacher.findByUserId(userResult.data.id);
        if (!teacherResult.success && !teacherResult.data){
            return new Response(JSON.stringify({success: false, data: 'Вчителя з даним email не знайдено'}), {status: 404});
        }

        const subjectResult = await Subject.findByNameAndClassesType(body.subject_name, body.classes_type);
        if (!subjectResult.success || !subjectResult.data){
            return new Response(JSON.stringify({success: false, data: 'Такий предмет не знайдено'}), {status: 404});
        }

        const lessonResult = await Lesson.updateById(body.lesson_id, subjectResult.data.id, teacherResult.data.id, body.start_time, body.end_time);
        if (!lessonResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло відредагувати урок'}), {status: 404});
        }

        return new Response(JSON.stringify({success: true, data: 'Ура!'}), {status: 200});

    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function POST(req) {
    const body = await req.json();
    try{
        const userResult = await User.findByEmail(body.teachersEmail);
        if (!userResult.success || !userResult.data){
            return new Response(JSON.stringify({success: false, data: 'Користувача з даним email не знайдено'}), {status: 404});
        }


        const teacherResult = await Teacher.findByUserId(userResult.data.id);
        if (!teacherResult.success && !teacherResult.data){
            return new Response(JSON.stringify({success: false, data: 'Вчителя з даним email не знайдено'}), {status: 404});
        }
        const subjectResult = await Subject.findByNameAndClassesType(body.subjectName, body.classesType);
        if (!subjectResult.success || !subjectResult.data){
            return new Response(JSON.stringify({success: false, data: 'Такий предмет не знайдено'}), {status: 404});
        }
        const lessonResult = await Lesson.add(subjectResult.data.id, teacherResult.data.id, body.scheduleId, body.subjectStartTime, body.subjectEndTime);
        if (!lessonResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло додати урок'}), {status: 404});
        }

        return new Response(JSON.stringify({success: true, data: 'Ура!'}), {status: 201});

    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function DELETE(req) {
    const body = await req.json();
    try{
        const result = await Lesson.deleteById(body.id);
        if (!result.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло видалити урок'}), {status: 404});
        }

        return new Response(JSON.stringify({success: true, data: 'Ура!'}), {status: 201});

    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}