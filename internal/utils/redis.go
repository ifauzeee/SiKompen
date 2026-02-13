package utils

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	RedisClient *redis.Client
	Ctx         = context.Background()
)

func InitRedis() {
	host := os.Getenv("REDIS_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("REDIS_PORT")
	if port == "" {
		port = "6379"
	}

	RedisClient = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", host, port),
		DB:   0,
	})

	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Printf("Warning: Failed to connect to Redis: %v", err)
	} else {
		log.Println("Connected to Redis successfully")
	}
}

func SetCache(key string, value interface{}, expiration time.Duration) error {
	if RedisClient == nil {
		return nil
	}
	return RedisClient.Set(Ctx, key, value, expiration).Err()
}

func GetCache(key string) (string, error) {
	if RedisClient == nil {
		return "", redis.Nil
	}
	return RedisClient.Get(Ctx, key).Result()
}

func DeleteCache(key string) error {
	if RedisClient == nil {
		return nil
	}
	return RedisClient.Del(Ctx, key).Err()
}

func ClearCachePattern(pattern string) error {
	if RedisClient == nil {
		return nil
	}
	iter := RedisClient.Scan(Ctx, 0, pattern, 0).Iterator()
	for iter.Next(Ctx) {
		if err := RedisClient.Del(Ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}
	return iter.Err()
}
