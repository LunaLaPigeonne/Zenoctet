const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'fill_form') {
            // Afficher le modal
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
        } else if (interaction.isModalSubmit() && interaction.customId === 'form_modal') {
            // Gérer la soumission du modal
            const firstName = interaction.fields.getTextInputValue('first_name');
            const lastName = interaction.fields.getTextInputValue('last_name');
            const group = interaction.fields.getTextInputValue('group');

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Nouvelle Inscription')
                .addFields(
                    { name: 'Prénom', value: firstName, inline: true },
                    { name: 'Nom', value: lastName, inline: true },
                    { name: 'Groupe', value: group, inline: true }
                );

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_entry')
                .setLabel('Accepter')
                .setStyle(ButtonStyle.Success);

            const rejectButton = new ButtonBuilder()
                .setCustomId('reject_entry')
                .setLabel('Refuser')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

            const channel = interaction.client.channels.cache.get('1291074777334677587');
            if (channel) {
                await channel.send({ embeds: [embed], components: [row] });
            }

            await interaction.reply({ content: 'Votre formulaire a été soumis avec succès.', ephemeral: true });
        } else if (interaction.isButton() && (interaction.customId === 'accept_entry' || interaction.customId === 'reject_entry')) {
            // Gérer les interactions avec les boutons d'acceptation et de refus
            const embed = interaction.message.embeds[0];
            const firstName = embed.fields.find(field => field.name === 'Prénom').value;
            const lastName = embed.fields.find(field => field.name === 'Nom').value;
            const group = embed.fields.find(field => field.name === 'Groupe').value;

            const userId = interaction.user.id;
            const user = await interaction.client.users.fetch(userId);
            if (!user) {
                return interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
            }

            if (interaction.customId === 'accept_entry') {
                await user.send(`Votre entrée a été acceptée. Bienvenue, ${firstName} ${lastName} du groupe ${group} !`);
                await interaction.update({ content: 'Entrée acceptée.', components: [] });
            } else if (interaction.customId === 'reject_entry') {
                await user.send(`Votre entrée a été refusée, ${firstName} ${lastName} du groupe ${group}.`);
                await interaction.update({ content: 'Entrée refusée.', components: [] });
            }
        }
    }
};