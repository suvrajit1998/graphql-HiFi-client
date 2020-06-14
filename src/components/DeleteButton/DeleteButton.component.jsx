import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, Icon, Confirm } from 'semantic-ui-react'

import MyPopup from '../../util/MyPopup'

import { FETCH_POST_QUERY } from '../../util/graphql'

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmopen, setconfirmopen] = useState(false)

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setconfirmopen(false)
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY,
        })
        data.getPosts = data.getPosts.filter((p) => p.id !== postId)

        proxy.writeQuery({ query: FETCH_POST_QUERY, data })
      }

      if (callback) callback()
    },
    variables: {
      postId,
      commentId,
    },
  })

  return (
    <>
      <MyPopup content={commentId ? 'Delete Comment' : 'Delete Post'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setconfirmopen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmopen}
        onCancel={() => setconfirmopen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletepost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`

export default DeleteButton
