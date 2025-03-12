


export class SumController {
    handleNotification = (msg: string) => {
        try {
            console.log(msg);
            const parsedMessage = JSON.parse(msg);


            console.log(`Received Notification`, parsedMessage);

            // Implement your own notification flow
            var result: number = this.makeSum(parsedMessage.payload.a, parsedMessage.payload.b)

            console.log(`Sum of ${parsedMessage.payload.a} and ${parsedMessage.payload.b} is ${result}`);


        } catch (error) {
            console.error(`Error executing job`);
        }
    };

    makeSum = (a: number, b: number): number => {
        return a + b;
    }
}