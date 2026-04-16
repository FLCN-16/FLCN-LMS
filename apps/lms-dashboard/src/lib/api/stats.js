import fetch from "@/lib/fetch";
export async function getInstituteStats(instituteSlug) {
    const response = await fetch.get(`/${instituteSlug}/stats`);
    return response.data;
}
