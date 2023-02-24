// Queries
export const uploads = gql`
    query ($model: Mixed, $groupBy: String, $removeNull: QueryUploadsWhereWhereConditions! = {}) {
        uploads(
            groupBy: $groupBy
            where: { AND: [{ column: UPLOADABLE_TYPE, value: $model }, $removeNull] }
        ) {
            tag
        }
    }
`
