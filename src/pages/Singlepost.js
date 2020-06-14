import React, { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Grid, Image, Card, Button, Form, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'
import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton/LikeButton.component'
import DeleteButton from '../components/DeleteButton/DeleteButton.component'
import MyPopup from '../util/MyPopup'

const Singlepost = ({ match, history }) => {
  const postId = match.params.postId
  const { user } = useContext(AuthContext)
  const [comment, setcomment] = useState('')

  const commentInputRef = useRef(null)

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  })

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setcomment('')
      commentInputRef.current.blur()
    },
    variables: {
      postId,
      body: comment,
    },
  })

  if (!data) {
    return <p>Loding...</p>
  }

  const { getPost } = data

  function deletePostCallback() {
    history.push('/')
  }

  let postMarkup
  if (!getPost) {
    postMarkup = <p>Loading post...</p>
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              floated="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header> {username} </Card.Header>
                <Card.Meta> {moment(createdAt).fromNow()} </Card.Meta>
                <Card.Description> {body} </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <MyPopup content="Comment on Post">
                  <Button
                    labelPosition="right"
                    as="div"
                    onClick={() => console.log('Comment on post')}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a Comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(e) => setcomment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        className="ui button teal"
                        type="submit"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header> {comment.username} </Card.Header>
                  <Card.Meta> {moment(comment.createdAt).fromNow()} </Card.Meta>
                  <Card.Description> {comment.body} </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`

export default Singlepost
