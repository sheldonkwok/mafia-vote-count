function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function getPost(ele) {
  const isPost = ele.classList.contains('post');

  if (isPost) return ele;
  return getPost(ele.parentElement);
}

function parseVoteEle(voteEle) {
  const messageText = voteEle.innerText;
  const vote = messageText.split('\n').filter(t => /vote/i.test(t)).pop();

  return vote;
}

function parsePost(postEle) {
  const postID = postEle.id;

  const username = document.querySelectorAll(`#${postID} a.o-user-link`)[0].innerText;

  const voteEle = document.querySelectorAll(`#${postID} .message > b`)[0];
  const vote = parseVoteEle(voteEle);

  return { username, vote };
}

function parsePage() {
  const posts = [];

  const messages = document.querySelectorAll('.message > b')
  messages.forEach(m => posts.push(getPost(m)));

  const votes = posts.map(parsePost);
  return votes;
}

async function prevPage(currPageNum) {
  const pages = document.querySelectorAll('.ui-pagination-page');

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (page.classList.contains('state-selected')) {
      pages[i - 1].click();
      break;
    }
  }

  currPageNum -= 1;
  await delay(2000);

  return currPageNum;
}

async function mainMafia() {
  const START_DATE = 51;
  const votesDict = {};

  let currPageNum = Number(document.querySelector('.ui-pagination-page.state-selected').innerText);

  while (currPageNum > START_DATE - 1) {
    const userVotes = parsePage().reverse();

    for (const userVote of userVotes) {
      const { username, vote } = userVote;

      if (votesDict[username]) continue;
      votesDict[username] = vote;
    }

    currPageNum = await prevPage(currPageNum);
  }

  const out = JSON.stringify(votesDict, null, 2);
  console.log(out);
  alert(out);
}
