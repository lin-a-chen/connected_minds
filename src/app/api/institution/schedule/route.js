import Schedule from "@/models/Schedule";
import Class from "@/models/Class";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const className = searchParams.get('class');
console.log('classname', className);
    try{
        const classResult = await Class.findByName(className);
        console.log('classResult', classResult);

        if (!classResult.success){
            return new Response(JSON.stringify({success: false, data: 'Class not found'}), {status: 404});
        }
        const result = await Schedule.findByClassId(classResult.data.id);
        console.log('result', result);

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'Schedule not found'}), {status: 404});
        }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

// export async function DELETE(req) {
//     const {searchParams} = new URL(req.url);
//     const id = searchParams.get("id");
//     try{
//         const result = await Subject.deleteById(id);

//         if (result.success){
//             return new Response(JSON.stringify({success: true, data: result.data}), {status: 201});
//         }
//         else{
//             return new Response(JSON.stringify({success: false, data: 'No subjects found'}), {status: 500});
//         }
//     }
//     catch(error){
//       return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
//     }
// }

// export async function PUT(req) {
//     const body = await req.json();
//     try{
//         const result = await Subject.updateById(body.id, body.name, body.classes_type);

//         if (result.success){
//             return new Response(JSON.stringify({success: true, data: result.data}), {status: 201});
//         }
//         else{
//             return new Response(JSON.stringify({success: false, data: 'Couldn\'t update subject'}), {status: 500});
//         }
//     }
//     catch(error){
//       return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
//     }
// }

// export async function POST(req) {
//     const body = await req.json();
//     try{
//         const result = await Subject.add(body.subjectName, body.classesType);

//         if (result.success){
//             return new Response(JSON.stringify({success: true, data: result.data}), {status: 201});
//         }
//         else{
//             return new Response(JSON.stringify({success: false, data: 'Couldn\'t update subject'}), {status: 500});
//         }
//     }
//     catch(error){
//       return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
//     }
// }