process.on('unhandledRejection', (error: NodeJS.ErrnoException) => {
  if (error.stack) {
    process.stdout.write('UNHANDLED REJECTION ');
    process.stdout.write(error.stack);
    process.stdout.write('\n');
  }
});

// new Promise(() => {
//   throw new Error('Try rejection');
// });
