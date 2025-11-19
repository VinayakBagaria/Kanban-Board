package seed

import "gorm.io/gorm"

func Seed(gormDb *gorm.DB) error {
	return SeedUser(gormDb)
}
