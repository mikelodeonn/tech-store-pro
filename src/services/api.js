const BASE_URL = "https://dummyjson.com";

export async function request(endpoint, options = {}) {
  const  {body, headers, ...rest} = options;

  const res = await fetch(`${BASE_URL}${endpoint}`,
    { ...rest,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,

      },
      body: body ? JSON.stringify(body) : undefined,
     
    }
  );

  const data = await res.json().catch(() => null);
  
  
  if (!res.ok) {
    const error = new Error(data?.message || `Error ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return data;
}

