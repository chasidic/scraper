process.on('unhandledRejection', (error) => {
    if (error.stack) {
        process.stdout.write('UNHANDLED REJECTION ');
        process.stdout.write(error.stack);
        process.stdout.write('\n');
    }
});
// new Promise(() => {
//   throw new Error('Try rejection');
// });
