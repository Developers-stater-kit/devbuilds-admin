import { composeSchema } from "./types/input-validation";
import { composeService } from "./service/service";


export async function POST(request: Request) {
  try {

    // 1️⃣ Validate input shape
    const input = composeSchema.parse(await request.json());

    // 2️⃣ Call core service
    const result = await composeService(input);                                                             

    // 3️⃣ Send build plan
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    // 4️⃣ Handle validation / service errors
    return new Response(JSON.stringify({
      error: error.message || "Failed to compose project",
    }), { status: 400 });
  }
}


