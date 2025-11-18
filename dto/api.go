package dto

type GeneralErrorResponse struct {
	Error string         `json:"error"`
	Meta  map[string]any `json:"meta,omitempty"`
}
