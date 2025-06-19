import { CategorizedReplayGroup } from "@/types/replay.types";
import ReplayCard from "./ReplayCard";
import { ChevronRightIcon } from "./Icon";
import * as React from "react";

interface CategoryReplaySectionProps {
  group: CategorizedReplayGroup;
}

const CategoryReplaySection: React.FC<CategoryReplaySectionProps> = ({
  group,
}) => {
  // Call useMemo unconditionally
  const filteredCategorizedReplays = React.useMemo(() => {
    if (!group || !group.replays || group.replays.length === 0) {
      return [];
    }
    // Filter replays: include the first replay (index 0), one replay from index 4, and up to 6 more
    const result = [group.replays[0]]; // Always include the first video (index 0)
    if (group.replays[4]) result.push(group.replays[4]); // Include one video from index 4 if it exists
    const remainingReplays = group.replays.slice(5); // Start after index 4
    result.push(...remainingReplays.slice(0, 6)); // Add up to 6 more videos
    return result.slice(0, 8); // Limit to a total of 8 videos
  }, [group]);

  if (filteredCategorizedReplays?.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      {/* Header section commented out but preserved for potential reuse */}
      {/* <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-white flex items-center">
          {group.icon && <span className="mr-2">{group.icon}</span>}
          {group.title}
        </h2>
        {group.viewAllUrl && (
          <a
            href={group.viewAllUrl}
            className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center"
          >
            Xem tất cả <ChevronRightIcon className="w-4 h-4 ml-1" />
          </a>
        )}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-4 gap-4">
        {filteredCategorizedReplays.map((replay) => (
          <ReplayCard
            key={replay?._id} // Use optional chaining to handle potential undefined _id
            replay={replay}
            variant="default"
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryReplaySection;
