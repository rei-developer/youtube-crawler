const fields = [
  { label: '작성자', value: 'author' },
  { label: '내용', value: 'text' },
  { label: '좋아요 수', value: 'likes' },
  { label: '날짜', value: 'time' },
  { label: '대댓글 작성자', value: 'replies.author' },
  { label: '대댓글 내용', value: 'replies.text' },
  { label: '대댓글 좋아요 수', value: 'replies.likes' },
  { label: '대댓글 날짜', value: 'replies.time' }
]

const fs = require('fs')
const fetchCommentPage = require('youtube-comment-api')
const Json2csvParser = require('json2csv').Parser
const json2csvParser = new Json2csvParser({ fields, unwind: 'replies' })

const logs = fs.createWriteStream('output.txt', { flags: 'w' })

const getData = (videoId, nextPageToken = null) => {
  fetchCommentPage(videoId, nextPageToken)
    .then(commentPage => {
      commentPage.comments.map(item => {
        item.text = item.text.replace(/\n/g, ' ')
        if (item.hasReplies) {
          item.replies.map(subItem => {
            subItem.text = subItem.text.replace(/\n/g, ' ')
            return subItem
          })
        }
        console.log(`${item.author} => ${item.text}`)
        return item
      })
      const csv = json2csvParser.parse(commentPage.comments)
      logs.write(`${csv}\n`)
      if (!commentPage.nextPageToken) return console.log('종료...')
      getData(videoId, commentPage.nextPageToken)
    })
}

// insert your youtube code
getData('Xc087l8tddg')