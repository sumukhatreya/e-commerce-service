export default function RatingAndReviewEntry({ username, rating, review }) {
    return (
        <div>
            <h3>Username: </h3><p>{username}</p>
            <br />
            <h3>Rating: </h3><p>{rating}</p>
            <br />
            <h3>Review: </h3>
            <p>{review}</p>
        </div>
    );
}

