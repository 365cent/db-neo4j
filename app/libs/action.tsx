'use server'

import { cookies } from 'next/headers'

interface Note {
    note_title: string,
    note_id: string,
    note_created_date: string,
    tag_name: string[],
    course_name: string,
    note_content: string,
}

export async function fetchUniversityList() {
    const response = await fetch('https://dash.note.lat/api/getAllUni', {
        method: 'GET'
    })
    const json = await response.json()
    return json.data
}

export async function handleSignup(formData: FormData) {
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const universityName = formData.get('universityName') as string

    const response = await fetch('https://dash.note.lat/api/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_name: username,
            user_email: email,
            user_password: password,
            uni_name: universityName,
        }),
    })

    if (response.ok) {
        // We'll handle cookie setting in a separate server action
        const responseData = await response.json()
        return { success: responseData.success, user: responseData.user }
    } else if (response.status === 409) {
        return { success: false, error: 'User already exists' }
    } else {
        return { success: false, error: 'Signup failed' }
    }
}

export async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const response = await fetch('https://dash.note.lat/api/userLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_email: email,
            user_password: password,
        }),
    })

    if (response.ok) {
        // We'll handle cookie setting in a separate server action
        const responseData = await response.json()
        return { success: responseData.success, user: responseData.user }
    } else {
        return { success: false, error: 'Login failed' }
    }
}


export async function setUserCookie(username: string, email: string) {
    const cookieStore = await cookies()
    cookieStore.set('user', username)
    cookieStore.set('email', email)
}

export async function getUserCookie() {
    const cookieStore = await cookies()
    try {
        const username = cookieStore.get('user')
        const email = cookieStore.get('email')
        return { username, email }
    }
    catch (e) {
        console.log(e)
        return null
    }
}

export async function delUserCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('user')
    cookieStore.delete('email')
}

export async function createNote(data: Note) {
    const response = await fetch('https://dash.note.lat/api/addNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Use the passed `data` directly
    });

    console.log(data);

    const json = await response.json();
    return json.data; // Return the relevant part of the response
}
