import client, { Channel } from "amqplib";


type HandlerCB = (msg: string) => any;


class RabbitMQConnection {
    connection!: client.ChannelModel;
    channel!: Channel;
    private connected!: Boolean;

    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            this.connection = await client.connect(
                process.env.RABBIT_URL as string
            );


            this.channel = await this.connection.createChannel();
            console.log(`Connected to MQ Server`);

        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async consume(queueName: string, handleIncomingNotification: HandlerCB) {


        await this.channel.assertQueue(queueName, {
            durable: true,
        });

        this.channel.consume(
            queueName,
            (msg) => {
                {
                    console.log(`Received message`);
                    if (!msg) {
                        return console.error(`Invalid incoming message`);
                    }
                    handleIncomingNotification(msg?.content?.toString());
                    this.channel.ack(msg);
                }
            },
            {
                noAck: false,
            }
        );

    }

    async sendToQueue(queue: string, message: any) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertQueue(queue, { durable: true });

            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

const mqConnection = new RabbitMQConnection();

export default mqConnection;