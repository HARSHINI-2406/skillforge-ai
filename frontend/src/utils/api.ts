const API_BASE = "http://127.0.0.1:8000";


export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {

  const token = localStorage.getItem(
    "skillforge_token"
  );


  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };


  if(token){
    headers["Authorization"] =
      `Bearer ${token}`;
  }


  // Add JSON header automatically
  if(
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ){

    headers["Content-Type"] =
      "application/json";

  }



  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,
      headers,
    }
  );



  if(!response.ok){

    const text =
      await response.text();


    let message =
      "Something went wrong";


    try{

      const json =
        JSON.parse(text);

      message =
        json.detail || message;

    }

    catch{

      message =
        text || message;

    }


    throw new Error(message);

  }



  // Handle empty responses
  const contentType =
    response.headers.get(
      "content-type"
    );


  if(
    contentType &&
    contentType.includes("application/json")
  ){

    return response.json();

  }


  return null;

}




// FastAPI OAuth2 login
export async function loginRequest(
  email:string,
  password:string
){


  const formData =
    new URLSearchParams();


  formData.append(
    "username",
    email
  );


  formData.append(
    "password",
    password
  );



  const response =
    await fetch(
      `${API_BASE}/api/auth/login`,
      {
        method:"POST",

        headers:{
          "Content-Type":
          "application/x-www-form-urlencoded",
        },

        body:
        formData.toString(),
      }
    );



  if(!response.ok){


    const text =
      await response.text();


    let message =
      "Login failed";


    try{

      const json =
        JSON.parse(text);

      message =
        json.detail || message;

    }

    catch{

      message =
        text || message;

    }


    throw new Error(message);

  }



  return response.json();

}