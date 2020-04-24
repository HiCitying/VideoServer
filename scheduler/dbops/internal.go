package dbops

import (
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func ReadVideoDeletionRecord(count int) ([]string, error) {
	stmtOut, err := dbConn.Prepare("SELECT video_id FROM video_del_rec LIMIT ?")

	var ids []string

	if err != nil {
		log.Printf("ReadVideo Error : %v", err)
		return ids, err
	}
	defer stmtOut.Close()

	rows, err := stmtOut.Query(count)
	if err != nil {
		log.Printf("Query VideoDeletionRecord error : %v", err)
		return ids, err
	}

	for rows.Next() {
		var id  string
		if err := rows.Scan(&id); err != nil {
			return ids, err
		}

		ids = append(ids, id)
	}

	return ids, nil
}

func DelVideoDeletionRecord(vid string) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM video_del_rec WHERE video_id = ?")
	if err != nil {
		log.Printf("Prepare error : %v", err)
		return err
	}

	defer stmtDel.Close()

	_, err = stmtDel.Exec(vid)
	if err != nil {
		log.Printf("Deleting DelVideoDeletionRecord error : %v", err)
		return err
	}

	return nil
}