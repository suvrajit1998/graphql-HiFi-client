import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, Icon, Label } from 'semantic-ui-react'
import MyPopup from '../../util/MyPopup'

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setliked] = useState(false)
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setliked(true)
    } else setliked(false)
  }, [user, likes])

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  })

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  )

  return (
    <div>
      <Button as="div" labelPosition="right" onClick={likePost}>
        <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </div>
  )
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`

export default LikeButton
