# Ruby sample: modules, classes, mixins, blocks, symbols, regex, and pattern matching
module Klang
  module ThemeSamples
    module Sluggable
      def slug
        title.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")
      end
    end

    class Article
      include Sluggable

      attr_reader :title, :tags, :metadata

      def initialize(title:, tags: [], metadata: {})
        @title = title
        @tags = tags
        @metadata = metadata
      end

      def featured?
        tags.include?(:featured) || metadata.fetch(:priority, 0) > 5
      end

      def to_h
        {
          title: title,
          slug: slug,
          featured: featured?,
          tags: tags.map(&:to_s)
        }
      end
    end

    def self.describe(article)
      case article.to_h
      in { title:, featured: true, ** }
        "Featured: #{title}"
      in { title:, tags: [] }
        "Untagged: #{title}"
      else
        "Regular article"
      end
    end
  end
end
