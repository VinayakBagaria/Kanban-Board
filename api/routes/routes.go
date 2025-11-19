package routes

import "github.com/gin-gonic/gin"

type Route struct {
	Path    string
	Method  string
	Handler gin.HandlerFunc
}

func Install(router *gin.RouterGroup, routeList []*Route) {
	for _, route := range routeList {
		router.Handle(route.Method, route.Path, route.Handler)
	}
}
