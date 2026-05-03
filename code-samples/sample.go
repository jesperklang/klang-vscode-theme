// Go sample: structs, interfaces, goroutines, channels, errors, and generics
package main

import (
	"context"
	"errors"
	"fmt"
	"time"
)

type Identifiable interface {
	ID() string
}

type Job[T Identifiable] struct {
	Payload T
	Retries int
	Tags    []string
}

type Message struct {
	id   string
	Body string
}

func (message Message) ID() string { return message.id }

func process[T Identifiable](ctx context.Context, jobs <-chan Job[T]) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case job, ok := <-jobs:
			if !ok {
				return nil
			}
			if job.Retries < 0 {
				return errors.New("retries cannot be negative")
			}
			fmt.Printf("processing %s with %d tags\n", job.Payload.ID(), len(job.Tags))
		}
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 250*time.Millisecond)
	defer cancel()

	jobs := make(chan Job[Message], 1)
	jobs <- Job[Message]{Payload: Message{id: "msg-001", Body: "hello"}, Retries: 2, Tags: []string{"theme", "sample"}}
	close(jobs)

	if err := process(ctx, jobs); err != nil {
		fmt.Println("error:", err)
	}
}
