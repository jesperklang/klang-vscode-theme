// Rust sample: traits, lifetimes, enums, macros, matches, and results
use std::collections::HashMap;
use std::fmt::{self, Display};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
enum Level {
    Info,
    Warning,
    Error,
}

trait Renderable {
    fn render(&self) -> String;
}

struct Notice<'a> {
    level: Level,
    message: &'a str,
    tags: Vec<String>,
}

impl Display for Level {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let value = match self {
            Level::Info => "info",
            Level::Warning => "warning",
            Level::Error => "error",
        };
        write!(formatter, "{value}")
    }
}

impl<'a> Renderable for Notice<'a> {
    fn render(&self) -> String {
        format!("[{}] {} ({:?})", self.level, self.message, self.tags)
    }
}

fn count_by_level(notices: &[Notice<'_>]) -> Result<HashMap<Level, usize>, &'static str> {
    if notices.is_empty() {
        return Err("no notices to count");
    }

    let mut counts = HashMap::new();
    for notice in notices {
        *counts.entry(notice.level.clone()).or_insert(0) += 1;
    }
    Ok(counts)
}

fn main() {
    let notices = vec![Notice { level: Level::Warning, message: "Check contrast", tags: vec!["theme".into()] }];
    println!("{:?}", count_by_level(&notices));
}
