import Subject from "@/models/Subject";

export async function POST(req) {
    const body = await req.json();
    try{
        
        const findSubjectResult = await Subject.findByNameAndClassesType(body.subjectName, body.classesType);
        if (!findSubjectResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося перевірити чи предмет вже існує'}), {status: 500});
        }
        if (findSubjectResult.data){
            return new Response(JSON.stringify({success: false, data: 'Предмет вже існує'}), {status: 500});
        }

           return new Response(JSON.stringify({success: true, data: "Ура!"}), {status: 201});
        
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}