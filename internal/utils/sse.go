package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
)

type Event struct {
	Type    string `json:"type"`
	Message string `json:"message"`
	UserID  uint   `json:"userId,omitempty"`
}

type SSEBroker struct {
	clients    map[chan Event]bool
	newClients chan chan Event
	defClients chan chan Event
	messages   chan Event
	mu         sync.Mutex
}

var Broker *SSEBroker

func InitSSE() {
	Broker = &SSEBroker{
		clients:    make(map[chan Event]bool),
		newClients: make(chan chan Event),
		defClients: make(chan chan Event),
		messages:   make(chan Event),
	}
	go Broker.listen()
}

func (b *SSEBroker) listen() {
	for {
		select {
		case s := <-b.newClients:
			b.mu.Lock()
			b.clients[s] = true
			b.mu.Unlock()
			log.Println("New SSE client connected")
		case s := <-b.defClients:
			b.mu.Lock()
			if _, ok := b.clients[s]; ok {
				delete(b.clients, s)
				close(s)
			}
			b.mu.Unlock()
			log.Println("SSE client disconnected")
		case msg := <-b.messages:
			b.mu.Lock()
			for s := range b.clients {
				select {
				case s <- msg:
				default:
				}
			}
			b.mu.Unlock()
		}
	}
}

func SSEHandler(c *gin.Context) {
	clientChan := make(chan Event)
	Broker.newClients <- clientChan

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	c.Stream(func(w io.Writer) bool {
		select {
		case msg, ok := <-clientChan:
			if !ok {
				return false
			}
			jsonData, _ := json.Marshal(msg)
			fmt.Fprintf(w, "data: %s\n\n", jsonData)
			return true
		case <-c.Request.Context().Done():
			return false
		}
	})

	Broker.defClients <- clientChan
}

func BroadcastEvent(eventType string, message string, userID uint) {
	if Broker == nil {
		return
	}
	Broker.messages <- Event{
		Type:    eventType,
		Message: message,
		UserID:  userID,
	}
}
