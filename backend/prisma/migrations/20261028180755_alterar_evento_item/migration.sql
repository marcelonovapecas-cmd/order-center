/*
  Warnings:

  - The values [QUANTIDADE_ALTERADA] on the enum `TiposEvento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TiposEvento_new" AS ENUM ('PEDIDO_CRIADO', 'STATUS_ALTERADO', 'ITEM_ADICIONADO', 'ITEM_REMOVIDO', 'ITEM_ALTERADO');
ALTER TABLE "EventoPedido" ALTER COLUMN "tipo" TYPE "TiposEvento_new" USING ("tipo"::text::"TiposEvento_new");
ALTER TYPE "TiposEvento" RENAME TO "TiposEvento_old";
ALTER TYPE "TiposEvento_new" RENAME TO "TiposEvento";
DROP TYPE "public"."TiposEvento_old";
COMMIT;
