// C++ sample: templates, namespaces, classes, lambdas, constexpr, and STL containers
#include <algorithm>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>
#include <vector>

namespace klang::samples {
constexpr std::string_view accent = "#ff55c8";

template <typename T>
concept Printable = requires(T value) {
    std::cout << value;
};

class Palette {
public:
    explicit Palette(std::vector<std::string> colors) : colors_(std::move(colors)) {}

    [[nodiscard]] std::optional<std::string> find(std::string_view prefix) const {
        auto match = std::find_if(colors_.begin(), colors_.end(), [prefix](const std::string& color) {
            return color.starts_with(prefix);
        });
        if (match == colors_.end()) {
            return std::nullopt;
        }
        return *match;
    }

private:
    std::vector<std::string> colors_;
};

template <Printable T>
void log_value(const T& value) {
    std::cout << "value=" << value << '\n';
}
} // namespace klang::samples

int main() {
    klang::samples::Palette palette({"#ff55c8", "#00f0ff", "#05ffa1"});
    if (auto color = palette.find("#ff")) {
        klang::samples::log_value(*color);
    }
}
