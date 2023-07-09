const usernameElement = document.getElementById('username');
const createPostForm = document.getElementById('createPostForm');
const userPostsContainer = document.getElementById('userPosts');
const trending = document.getElementsByClassName('.div1');
const setting = document.getElementById('setting');
const home = document.getElementById('home');
const tred = document.getElementById('Trending')
const tredLink = document.getElementById('trendPage');
const useLink = document.getElementById('UserPage')
useLink.style.display = "none";
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
usernameElement.textContent = username;
tredLink.addEventListener('click', () => {
  tred.style.display = "block";
  useLink.style.display = "none";
})
home.addEventListener('click', () => {
  tred.style.display = "none";
  useLink.style.display = "block";
})

// Event listener for create post form submission
createPostForm.addEventListener('submit', (e) => {
  e.preventDefault();
  updatePostForm();
});

// Event listener for setting button
setting.addEventListener('click', (e) => {
  location.href = `setting.html?username=${username}`;
});

// Fetch and display user's posts on page load
fetchUserPosts();
allpost();

// Function to update the DOM after posting a new post
function updatePostForm() {
  const topic = document.getElementById('topic').value;
  const post = document.getElementById('post').value;

  // Send post data to the server
  fetch('https://shadow-web.onrender.com/posts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, post, user: username }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Clear form fields
      document.getElementById('topic').value = '';
      document.getElementById('post').value = '';

      // Create a new post element and append it to the posts container
      const postElement = createPostElement(data); // Assuming data contains the newly created post object
      userPostsContainer.appendChild(postElement);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to update the DOM after liking a post
function updateLike(postId) {
  const user = username;
  fetch(`https://shadow-web.onrender.com/posts/like/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Update the likes count for the specific post in the DOM
      const likeBtn = document.querySelector(`.post[data-postid="${postId}"] .likeBtn`);
      likeBtn.textContent = `Like (${data.likes})`;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to update the DOM after adding a comment to a post
function updateComment(postId, comment) {
  const user = username;
  fetch(`https://shadow-web.onrender.com/posts/comment/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, comment }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Create a new comment element and append it to the respective post's comments container
      const commentElement = createCommentElement(data); // Assuming data contains the newly created comment object
      const commentsContainer = document.querySelector(`.post[data-postid="${postId}"] .comments`);
      commentsContainer.appendChild(commentElement);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to create a new post element
function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.classList.add('post');
  postElement.setAttribute('data-postid', post._id);
  postElement.innerHTML = `
    <div class="form-container">
      <h3 style="color: #333; font-size: 24px; margin-bottom: 10px;">User: ${post.user.username}</h3>
      <h3 class="topic">Topic: ${post.topic}</h3>
      <p><span><b>Post : </b></span>${post.post}</p>
      <button class="likeBtn">Like (${post.likes})</button>
      <button class="commentBtn">Comment</button>
      <div class="comments">
        ${getCommentsHTML(post.comments)}
      </div>
      <hr>
    </div>
  `;

  // Event listener for like button
  const likeBtn = postElement.querySelector('.likeBtn');
  likeBtn.addEventListener('click', () => {
    updateLike(post._id);
  });

  // Event listener for comment button
  const commentBtn = postElement.querySelector('.commentBtn');
  commentBtn.addEventListener('click', () => {
    const comment = prompt('Enter your comment:');
    if (comment) {
      updateComment(post._id, comment);
    }
  });

  return postElement;
}

// Function to create a new comment element
function createCommentElement(comment) {
  const commentElement = document.createElement('p');
  commentElement.innerHTML = `<span>${comment.user.username}:</span> ${comment.comment}`;
  return commentElement;
}

// Function to generate HTML for comments
function getCommentsHTML(comments) {
  let html = '';
  comments.forEach((comment) => {
    html += `<p><span>${comment.user.username}:</span> ${comment.comment}</p>`;
  });
  return html;
}

// Function to fetch user's posts and update the DOM
function fetchUserPosts() {
  fetch(`https://shadow-web.onrender.com/posts/user/${username}`)
    .then((response) => response.json())
    .then((data) => {
      userPostsContainer.innerHTML = '';

      data.forEach((post) => {
        const postElement = createPostElement(post);
        userPostsContainer.appendChild(postElement);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to fetch all posts and update the DOM
function allpost() {
  fetch('https://shadow-web.onrender.com/posts/all')
    .then((response) => response.json())
    .then((posts) => {
      postsContainer.innerHTML = '';
      posts.sort((b, a) => (a.likes + a.comments.length) - (b.likes + b.comments.length));
      posts.forEach((post) => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
