<?php
// PHP sample: namespaces, attributes, enums, readonly properties, arrays, and exceptions

declare(strict_types=1);

namespace Klang\ThemeSamples;

use DateTimeImmutable;
use RuntimeException;

#[\Attribute(\Attribute::TARGET_CLASS)]
final class Preview
{
    public function __construct(public readonly string $name) {}
}

enum State: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}

#[Preview('content')]
final class Article
{
    public function __construct(
        public readonly string $title,
        public readonly State $state,
        public readonly DateTimeImmutable $createdAt,
        private array $tags = [],
    ) {}

    public function hasTag(string $tag): bool
    {
        return in_array($tag, $this->tags, strict: true);
    }

    public function publish(): self
    {
        if ($this->state === State::Archived) {
            throw new RuntimeException('Archived articles cannot be published');
        }

        return new self($this->title, State::Published, $this->createdAt, $this->tags);
    }
}
