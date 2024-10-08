const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            console.log(`[XenoLog] Command '${interaction.commandName}' requested by ${interaction.user.tag}`);

            // Vérification des permissions
            if (command.ownerOnly && interaction.user.id !== process.env.BOT_OWNER_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée au propriétaire du bot.', ephemeral: true });
            }

            if (command.devOnly && interaction.user.id !== process.env.BOT_DEV_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée aux développeurs du bot.', ephemeral: true });
            }

            if (command.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée aux administrateurs.', ephemeral: true });
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`[XenoError] Erreur lors de l'exécution de la commande '${interaction.commandName}' :`, error);
                const embed = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setTitle('🛑 Erreur')
                    .setDescription('Une erreur est survenue lors de l\'exécution de cette commande.');
                interaction.reply({ embeds: [embed] });
            }
        } else if (interaction.isButton()) {
            // Handle button interactions
            if (interaction.customId === 'fill_form') {
                const modal = new ModalBuilder()
                    .setCustomId('form_modal')
                    .setTitle('Formulaire d\'inscription');

                const firstNameInput = new TextInputBuilder()
                    .setCustomId('first_name')
                    .setLabel('Prénom')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const lastNameInput = new TextInputBuilder()
                    .setCustomId('last_name')
                    .setLabel('Nom')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const groupInput = new TextInputBuilder()
                    .setCustomId('group')
                    .setLabel('Groupe (C1 ou C2)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const firstNameRow = new ActionRowBuilder().addComponents(firstNameInput);
                const lastNameRow = new ActionRowBuilder().addComponents(lastNameInput);
                const groupRow = new ActionRowBuilder().addComponents(groupInput);

                modal.addComponents(firstNameRow, lastNameRow, groupRow);

                await interaction.showModal(modal);
            }
        } else if (interaction.isModalSubmit()) {
            // Handle modal submissions
            if (interaction.customId === 'form_modal') {
                const firstName = interaction.fields.getTextInputValue('first_name');
                const lastName = interaction.fields.getTextInputValue('last_name');
                const group = interaction.fields.getTextInputValue('group');

                await interaction.reply(`Formulaire soumis avec succès !\nPrénom: ${firstName}\nNom: ${lastName}\nGroupe: ${group}`);
            }
        }
    }
};