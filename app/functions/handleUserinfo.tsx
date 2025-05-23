import db from '../../databases/supabase';

export async function findUserByID(userId: string) {
    const { data, error } = await db
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}