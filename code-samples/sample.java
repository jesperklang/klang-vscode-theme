// Java sample: packages, annotations, records, streams, enums, and exceptions
package samples.klang;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@FunctionalInterface
interface Slugifier {
    String slugify(String input);
}

public final class SampleJava {
    public enum Priority { LOW, NORMAL, HIGH }

    public record Task(String title, Priority priority, Instant createdAt) {
        public Task {
            if (title == null || title.isBlank()) {
                throw new IllegalArgumentException("title is required");
            }
        }
    }

    private final Slugifier slugifier = input -> input.toLowerCase().replaceAll("[^a-z0-9]+", "-");

    public Map<Priority, List<String>> groupTitles(List<Task> tasks) {
        return tasks.stream()
            .collect(Collectors.groupingBy(
                Task::priority,
                Collectors.mapping(task -> slugifier.slugify(task.title()), Collectors.toList())
            ));
    }

    public Optional<Task> firstHighPriority(List<Task> tasks) {
        return tasks.stream().filter(task -> task.priority() == Priority.HIGH).findFirst();
    }
}
