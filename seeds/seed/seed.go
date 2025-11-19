package seed

import "gorm.io/gorm"

func Seed(gormDb *gorm.DB) error {
	if err := SeedUsers(gormDb); err != nil {
		return err
	}

	if err := SeedLabels(gormDb); err != nil {
		return err
	}

	if err := SeedIssues(gormDb); err != nil {
		return err
	}

	return nil
}
