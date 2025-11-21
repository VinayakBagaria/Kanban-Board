package tests

import (
	"errors"
	"kanban-board/db"
	"kanban-board/dto"

	"time"

	"github.com/google/uuid"
)

type fakeIssueRepository struct {
	data     map[string]*db.Issue
	maxOrder int
}

func NewFakeIssueRepository() *fakeIssueRepository {
	return &fakeIssueRepository{
		data:     map[string]*db.Issue{},
		maxOrder: 0,
	}
}

func (r *fakeIssueRepository) GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error) {
	var issues []*db.Issue
	for _, eachIssue := range r.data {
		issues = append(issues, eachIssue)
	}
	return &dto.IssueListResponse{Data: issues, Total: int64(len(issues))}, nil
}

func (f *fakeIssueRepository) GetIssue(issueId string) (*db.Issue, error) {
	if val, ok := f.data[issueId]; ok {
		return val, nil
	}

	return nil, errors.New("unable to find")
}

func (f *fakeIssueRepository) CreateIssue(req dto.CreateIssueRequest) (string, error) {
	issue := &db.Issue{
		ID:          uuid.New(),
		CreatedOn:   time.Now().Unix(),
		UpdatedOn:   time.Now().Unix(),
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
		OrderIndex:  f.maxOrder,
		Priority:    req.Priority,
		AssigneeId:  req.AssigneeID,
	}
	f.data[issue.ID.String()] = issue
	f.maxOrder = issue.OrderIndex
	return issue.ID.String(), nil
}

func (f *fakeIssueRepository) UpdateIssue(issueId string, req dto.UpdateIssueRequest) error {
	for _, eachRow := range f.data {
		if eachRow.ID.String() == issueId {
			updatedPicture := &db.Issue{
				ID:          eachRow.ID,
				Title:       req.Title,
				Description: req.Description,
				Status:      req.Status,
				OrderIndex:  f.maxOrder,
				Priority:    req.Priority,
				AssigneeId:  req.AssigneeID,
				CreatedOn:   eachRow.CreatedOn,
				UpdatedOn:   time.Now().Unix(),
			}
			f.data[eachRow.ID.String()] = updatedPicture
			return nil
		}
	}

	return errors.New("unable to find")
}

func (f *fakeIssueRepository) DeleteIssue(issueId string) error {
	if _, ok := f.data[issueId]; ok {
		delete(f.data, issueId)
		return nil
	}
	return errors.New("unable to find")
}

func (f *fakeIssueRepository) MoveIssueStatus(issueId string, req dto.MoveIssueRequest) error {
	return nil
}
