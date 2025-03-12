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
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;