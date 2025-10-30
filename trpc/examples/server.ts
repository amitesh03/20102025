import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

// Create context type
interface Context {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Create tRPC instance
const t = initTRPC.context<Context>().create();

// Create middleware for authentication
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new Error('Not authenticated');
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Create protected procedure
const protectedProcedure = t.procedure.use(isAuthed);

// In-memory database
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

let posts = [
  { id: '1', title: 'First Post', content: 'This is the first post', authorId: '1' },
  { id: '2', title: 'Second Post', content: 'This is the second post', authorId: '2' },
];

let comments = [
  { id: '1', content: 'Great post!', postId: '1', authorId: '2' },
  { id: '2', content: 'Thanks for sharing', postId: '2', authorId: '1' },
];

// Create app router
const appRouter = t.router({
  // Health check
  health: t.procedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User procedures
  getUsers: t.procedure.query(() => {
    return users;
  }),

  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }),

  createUser: t.procedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(({ input }) => {
      const newUser = {
        id: String(users.length + 1),
        ...input,
      };
      users.push(newUser);
      return newUser;
    }),

  updateUser: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
    }))
    .mutation(({ input }) => {
      const userIndex = users.findIndex(u => u.id === input.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex] = {
        ...users[userIndex],
        ...input,
      };
      return users[userIndex];
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const userIndex = users.findIndex(u => u.id === input.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);
      
      // Also delete user's posts and comments
      posts = posts.filter(p => p.authorId !== input.id);
      comments = comments.filter(c => c.authorId !== input.id);
      
      return deletedUser;
    }),

  // Post procedures
  getPosts: t.procedure
    .input(z.object({
      authorId: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }))
    .query(({ input }) => {
      let filteredPosts = posts;
      
      if (input.authorId) {
        filteredPosts = filteredPosts.filter(p => p.authorId === input.authorId);
      }
      
      if (input.offset) {
        filteredPosts = filteredPosts.slice(input.offset);
      }
      
      if (input.limit) {
        filteredPosts = filteredPosts.slice(0, input.limit);
      }
      
      return filteredPosts.map(post => ({
        ...post,
        author: users.find(u => u.id === post.authorId),
      }));
    }),

  getPost: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const post = posts.find(p => p.id === input.id);
      if (!post) {
        throw new Error('Post not found');
      }
      
      return {
        ...post,
        author: users.find(u => u.id === post.authorId),
        comments: comments
          .filter(c => c.postId === post.id)
          .map(comment => ({
            ...comment,
            author: users.find(u => u.id === comment.authorId),
          })),
      };
    }),

  createPost: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
    }))
    .mutation(({ input, ctx }) => {
      const newPost = {
        id: String(posts.length + 1),
        ...input,
        authorId: ctx.user!.id,
      };
      posts.push(newPost);
      return newPost;
    }),

  updatePost: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
    }))
    .mutation(({ input, ctx }) => {
      const postIndex = posts.findIndex(p => p.id === input.id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      if (posts[postIndex].authorId !== ctx.user!.id) {
        throw new Error('Not authorized to update this post');
      }
      
      posts[postIndex] = {
        ...posts[postIndex],
        ...input,
      };
      return posts[postIndex];
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      const postIndex = posts.findIndex(p => p.id === input.id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      if (posts[postIndex].authorId !== ctx.user!.id) {
        throw new Error('Not authorized to delete this post');
      }
      
      const deletedPost = posts[postIndex];
      posts.splice(postIndex, 1);
      
      // Also delete post's comments
      comments = comments.filter(c => c.postId !== input.id);
      
      return deletedPost;
    }),

  // Comment procedures
  getComments: t.procedure
    .input(z.object({
      postId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }))
    .query(({ input }) => {
      let filteredComments = comments.filter(c => c.postId === input.postId);
      
      if (input.offset) {
        filteredComments = filteredComments.slice(input.offset);
      }
      
      if (input.limit) {
        filteredComments = filteredComments.slice(0, input.limit);
      }
      
      return filteredComments.map(comment => ({
        ...comment,
        author: users.find(u => u.id === comment.authorId),
      }));
    }),

  createComment: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string().min(1),
    }))
    .mutation(({ input, ctx }) => {
      const newComment = {
        id: String(comments.length + 1),
        ...input,
        authorId: ctx.user!.id,
      };
      comments.push(newComment);
      return newComment;
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      const commentIndex = comments.findIndex(c => c.id === input.id);
      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }
      
      if (comments[commentIndex].authorId !== ctx.user!.id) {
        throw new Error('Not authorized to delete this comment');
      }
      
      const deletedComment = comments[commentIndex];
      comments.splice(commentIndex, 1);
      return deletedComment;
    }),

  // Stats procedure
  getStats: t.procedure.query(() => {
    return {
      users: users.length,
      posts: posts.length,
      comments: comments.length,
    };
  }),
});

// Export type router type
export type AppRouter = typeof appRouter;

// Create context function
const createContext = ({ req }: { req: any }): Context => {
  // In a real app, you'd extract the user from a JWT token
  // For this example, we'll simulate authentication
  const authHeader = req.headers.authorization;
  
  if (authHeader === 'Bearer valid-token') {
    return {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      },
    };
  }
  
  return {};
};

// Create server
createHTTPServer({
  router: appRouter,
  createContext,
}).listen(3000);

console.log('tRPC server running on http://localhost:3000');