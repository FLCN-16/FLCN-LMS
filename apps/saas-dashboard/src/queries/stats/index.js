import { useQuery } from "@tanstack/react-query";
import { getInstituteStats } from "@/lib/api/stats";
export function useInstituteStats(instituteSlug) {
    return useQuery({
        queryKey: ["institute", instituteSlug, "stats"],
        queryFn: () => getInstituteStats(instituteSlug),
        enabled: !!instituteSlug,
    });
}
